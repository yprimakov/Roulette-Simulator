using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Roulette_Simulator.Startup))]
namespace Roulette_Simulator
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
