using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace MoveShape21
{
    public class MouseMoveHub : Hub<IMoveShapeClient>
    {
        private static Point _position = new Point(0, 0);

        public Task UpdatePosition(Point position)
        {
            _position = position;
            return Clients.Others.PositionChanged(position);
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            await Clients.Caller.Connected(_position);
        }
    }

    public interface IMoveShapeClient
    {
        Task PositionChanged(Point position);
        Task Connected(Point position);
    }

    public class Point
    {
        public Point() { }

        public Point(int x, int y)
        {
            X = x;
            Y = y;
        }

        public int X { get; set; }

        public int Y { get; set; }
    }
}
