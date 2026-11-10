record Message(String role, String content) {}

var m1 = new Message("user", "hi");
var m2 = new Message("user", "hi");
m1.equals(m2);      // true
m1.toString();      // Message[role=user, content=hi]
m1.role();          // accessor; there is no setter
