using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace MoveShape21
{
    public class MouseMoveHub : Hub<IMoveShapeClient>
    {
        public Task UpdatePosition(Point position)
        {
            return Clients.Others.PositionChanged(position);
        }
    }

    public interface IMoveShapeClient
    {
        Task PositionChanged(Point position);
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