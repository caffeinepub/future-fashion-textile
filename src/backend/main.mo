import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  var nextProjectId = 1;
  let adminEmail = "admin@futurefashiontextile.com";

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ProjectId = Nat;
  public type ProjectCategory = {
    #uiUx;
    #branding;
    #graphicDesign;
  };

  public type Project = {
    id : ProjectId;
    title : Text;
    description : Text;
    category : ProjectCategory;
    imageUrl : Text;
    createdAt : Int;
  };

  public type ContactMessage = {
    id : Int;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
    isRead : Bool;
  };

  public type Service = {
    id : Nat;
    title : Text;
    description : Text;
    price : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  module Project {
    public func compareByCreatedAt(project1 : Project, project2 : Project) : Order.Order {
      Int.compare(project1.createdAt, project2.createdAt);
    };
  };

  module ContactMessage {
    public func compareByTimestamp(msg1 : ContactMessage, msg2 : ContactMessage) : Order.Order {
      Int.compare(msg1.timestamp, msg2.timestamp);
    };
  };

  let projects = Map.empty<ProjectId, Project>();
  let contacts = Map.empty<Int, ContactMessage>();
  let services = Map.empty<Nat, Service>();
  let userProfiles = Map.empty<Principal, UserProfile>();

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

  // Project Management
  public shared ({ caller }) func createProject(title : Text, description : Text, category : ProjectCategory, imageUrl : Text) : async ProjectId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create projects");
    };

    let projectId = nextProjectId;
    let project : Project = {
      id = projectId;
      title;
      description;
      category;
      imageUrl;
      createdAt = Int.abs(Time.now());
    };

    projects.add(projectId, project);
    nextProjectId += 1;
    projectId;
  };

  public shared ({ caller }) func updateProject(projectId : ProjectId, title : Text, description : Text, category : ProjectCategory, imageUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update projects");
    };

    switch (projects.get(projectId)) {
      case (null) {
        Runtime.trap("Project not found");
      };
      case (?existingProject) {
        let updatedProject : Project = {
          id = projectId;
          title;
          description;
          category;
          imageUrl;
          createdAt = existingProject.createdAt;
        };
        projects.add(projectId, updatedProject);
      };
    };
  };

  public shared ({ caller }) func deleteProject(projectId : ProjectId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete projects");
    };

    if (not projects.containsKey(projectId)) {
      Runtime.trap("Project not found");
    };

    projects.remove(projectId);
  };

  public query func getProject(projectId : ProjectId) : async Project {
    switch (projects.get(projectId)) {
      case (null) {
        Runtime.trap("Project not found");
      };
      case (?project) { project };
    };
  };

  public query func listProjects(category : ?ProjectCategory) : async [Project] {
    let filteredProjects = projects.values().toArray().filter(func(p) { switch (category) { case (null) { true }; case (?cat) { p.category == cat } } });
    filteredProjects.sort(Project.compareByCreatedAt);
  };

  // Contact Form - Public access for clients to submit
  public func submitContact(name : Text, email : Text, message : Text) : async () {
    let contact : ContactMessage = {
      id = contacts.size().toInt();
      name;
      email;
      message;
      timestamp = Int.abs(Time.now());
      isRead = false;
    };

    contacts.add(contact.id, contact);
  };

  public query ({ caller }) func getAllContacts() : async [ContactMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contacts");
    };

    contacts.values().toArray().sort(ContactMessage.compareByTimestamp);
  };

  public shared ({ caller }) func markContactAsRead(id : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update contact status");
    };

    switch (contacts.get(id)) {
      case (null) { Runtime.trap("Contact not found") };
      case (?contact) {
        let updatedContact : ContactMessage = {
          id = contact.id;
          timestamp = contact.timestamp;
          name = contact.name;
          email = contact.email;
          message = contact.message;
          isRead = true;
        };

        contacts.add(id, updatedContact);
      };
    };
  };

  // Services Management
  public shared ({ caller }) func addService(title : Text, description : Text, price : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add services");
    };

    let serviceId = services.size() + 1;
    let service : Service = {
      id = serviceId;
      title;
      description;
      price;
    };

    services.add(serviceId, service);
    serviceId;
  };

  public shared ({ caller }) func updateService(serviceId : Nat, title : Text, description : Text, price : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update services");
    };

    switch (services.get(serviceId)) {
      case (null) { Runtime.trap("Service not found") };
      case (?_existingService) {
        let updatedService : Service = {
          id = serviceId;
          title;
          description;
          price;
        };
        services.add(serviceId, updatedService);
      };
    };
  };

  public shared ({ caller }) func deleteService(serviceId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete services");
    };

    if (not services.containsKey(serviceId)) {
      Runtime.trap("Service not found");
    };

    services.remove(serviceId);
  };

  public query func getService(serviceId : Nat) : async Service {
    switch (services.get(serviceId)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) { service };
    };
  };

  public query func listServices() : async [Service] {
    services.values().toArray();
  };
};

