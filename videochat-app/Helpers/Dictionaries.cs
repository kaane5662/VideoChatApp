using System.Collections.Concurrent;

namespace Helpers {
    public class ConnectionsDictionary:ConcurrentDictionary<string,string>
    {
       
    }

    public class ConnectedRoomsDictionary:ConcurrentDictionary<string,string>
    {
        
    }
}