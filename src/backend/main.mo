import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  type Book = {
    id : Text;
    title : Text;
    author : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    uploadedAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  public type Dua = {
    id : Text;
    text : Text;
    aminCount : Nat;
    createdAt : Int;
  };

  module Book {
    public func compare(book1 : Book, book2 : Book) : Order.Order {
      Text.compare(book1.id, book2.id);
    };

    public func compareByTitle(book1 : Book, book2 : Book) : Order.Order {
      Text.compare(book1.title, book2.title);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  var prayerSearchCount = 0;
  var quranSearchCount = 0;
  var duaCounter = 0;
  let books = Map.empty<Text, Book>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let duas = Map.empty<Text, Dua>();

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Book Management
  func getBookInternal(id : Text) : ?Book {
    books.get(id);
  };

  public shared ({ caller }) func addBook(id : Text, title : Text, author : Text, description : Text, blob : Storage.ExternalBlob) : async Book {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add books");
    };
    if (getBookInternal(id) != null) { Runtime.trap("Book already exists") };
    let book : Book = {
      id;
      title;
      author;
      description;
      blob;
      uploadedAt = Time.now();
    };
    books.add(id, book);
    book;
  };

  public shared ({ caller }) func deleteBook(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete books");
    };
    if (getBookInternal(id) == null) { Runtime.trap("Book does not exist") };
    books.remove(id);
  };

  public query ({ caller }) func getBook(id : Text) : async Book {
    switch (getBookInternal(id)) {
      case (null) { Runtime.trap("Book does not exist") };
      case (?book) { book };
    };
  };

  public query ({ caller }) func listBooks() : async [Book] {
    books.values().toArray().sort(Book.compareByTitle);
  };

  // Community Dua - Anonymous
  public shared func submitDua(text : Text) : async Text {
    if (text.size() == 0 or text.size() > 500) {
      Runtime.trap("Dua text must be between 1 and 500 characters");
    };
    duaCounter += 1;
    let now = Time.now();
    let id = "dua_" # now.toText() # "_" # duaCounter.toText();
    let dua : Dua = {
      id;
      text;
      aminCount = 0;
      createdAt = now;
    };
    duas.add(id, dua);
    // Trim oldest if over 200
    let all = duas.values().toArray();
    if (all.size() > 200) {
      let sorted = all.sort(func(a : Dua, b : Dua) : Order.Order {
        Int.compare(a.createdAt, b.createdAt);
      });
      duas.remove(sorted[0].id);
    };
    id;
  };

  public query func listDuas() : async [Dua] {
    let all = duas.values().toArray();
    all.sort(func(a : Dua, b : Dua) : Order.Order {
      Int.compare(b.createdAt, a.createdAt);
    });
  };

  public shared func aminDua(id : Text) : async () {
    switch (duas.get(id)) {
      case (null) { Runtime.trap("Dua not found") };
      case (?dua) {
        let updated : Dua = {
          id = dua.id;
          text = dua.text;
          aminCount = dua.aminCount + 1;
          createdAt = dua.createdAt;
        };
        duas.add(id, updated);
      };
    };
  };

  // HTTP Outcalls - Public access (including guests)
  public shared ({ caller = _ }) func fetchPrayerTimes(city : Text, country : Text) : async Text {
    let apiUrl = "https://api.aladhan.com/v1/timingsByCity?city=" # city # "&country=" # country # "&method=2";
    let result = await OutCall.httpGetRequest(apiUrl, [], transform);
    prayerSearchCount += 1;
    result;
  };

  public shared ({ caller = _ }) func fetchQuranVerse(surah : Nat, ayah : Nat) : async Text {
    let apiUrl = "https://api.alquran.cloud/v1/ayah/" # surah.toText() # ":" # ayah.toText();
    let result = await OutCall.httpGetRequest(apiUrl, [], transform);
    quranSearchCount += 1;
    result;
  };

  // Statistics - Admin only
  public query ({ caller }) func getPrayerSearchCount() : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view statistics");
    };
    prayerSearchCount;
  };

  public query ({ caller }) func getQuranSearchCount() : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view statistics");
    };
    quranSearchCount;
  };
};
