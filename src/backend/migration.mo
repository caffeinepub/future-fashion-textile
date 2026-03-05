import Map "mo:core/Map";
import Int "mo:core/Int";

module {
  // Type for legacy ContactMessage without "id" and "isRead" fields
  type OldContactMessage = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  // Type for legacy actor state
  type OldActor = {
    contacts : Map.Map<Int, OldContactMessage>;
  };

  // Type for new/updated ContactMessage with "id" and "isRead" fields
  type NewContactMessage = {
    id : Int;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
    isRead : Bool;
  };

  // Type for new actor state
  type NewActor = {
    contacts : Map.Map<Int, NewContactMessage>;
  };

  // Migration function to convert old state to new state,
  // with explicit transformation of old contact messages to new format
  public func run(old : OldActor) : NewActor {
    let newContacts = old.contacts.map<Int, OldContactMessage, NewContactMessage>(
      func(id, oldContact) {
        {
          id;
          name = oldContact.name;
          email = oldContact.email;
          message = oldContact.message;
          timestamp = oldContact.timestamp;
          isRead = false;
        };
      }
    );
    {
      contacts = newContacts;
    };
  };
};
