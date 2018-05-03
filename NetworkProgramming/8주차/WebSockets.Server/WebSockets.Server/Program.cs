using Fleck;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSockets.Server
{
    class Program
    {
        static void Main(string[] args)
        {
            // Store the subscribed clients.
            var clients = new List<IWebSocketConnection>();

            // Initialize the WebSocket server connection.
            var server = new WebSocketServer("ws://localhost:8181");

            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    // Add the incoming connection to our list.
                    clients.Add(socket);
                };

                socket.OnClose = () =>
                {
                    // Remove the disconnected client from the list.
                    clients.Remove(socket);
                };

                socket.OnMessage = message =>
                {
                    // Client sends a JSON-encoded string message.
                    
                    // Send the message as-is and the client will decode it appropriately.
                    foreach (var client in clients)
                    {
                        client.Send(message);
                    }
                };

                socket.OnBinary = message =>
                {
                    // Client sends a binary message (we accept images).

                    // Send this file to everyone.
                    foreach (var client in clients)
                    {
                        client.Send(message);
                    }
                };
            });

            // Wait for a key press to close...
            Console.ReadLine();
        }
    }
}
