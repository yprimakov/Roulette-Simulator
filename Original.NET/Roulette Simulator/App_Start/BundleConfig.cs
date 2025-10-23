using System.Web;
using System.Web.Optimization;

namespace Roulette_Simulator
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundles/globalStyles").Include(
                        "~/Content/metronic_v4.7/theme/assets/global/plugins/font-awesome/css/font-awesome.min.css",
                        "~/Content/metronic_v4.7/theme/assets/global/plugins/simple-line-icons/simple-line-icons.min.css",
                        "~/Content/metronic_v4.7/theme/assets/global/plugins/bootstrap/css/bootstrap.min.css",
                        "~/Content/metronic_v4.7/theme/assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css",
                        "~/Content/metronic_v4.7/theme/assets/global/css/components-md.min.css",
                        "~/Content/metronic_v4.7/theme/assets/global/css/plugins-md.min.css",
                        "~/Content/metronic_v4.7/theme/assets/layouts/layout3/css/layout.css",
                        "~/Content/metronic_v4.7/theme/assets/layouts/layout3/css/themes/default.min.css",
                        "~/Content/Site.css"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/globalScripts").Include(
                        "~/Content/metronic_v4.7/theme/assets/global/plugins/jquery.min.js",
                        "~/Content/metronic_v4.7/theme/assets/global/plugins/bootstrap/js/bootstrap.min.js",
                        "~/Content/metronic_v4.7/theme/assets/global/plugins/angularjs/angular.min.js",
                        "~/Content/metronic_v4.7/theme/assets/global/plugins/angularjs/angular-sanitize.min.js",
                        "~/Content/metronic_v4.7/theme/assets/global/plugins/js.cookie.min.js",
                        "~/Content/metronic_v4.7/theme/assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js",
                        "~/Content/metronic_v4.7/theme/assets/global/plugins/jquery.blockui.min.js",
                        "~/Content/metronic_v4.7/theme/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js",
                        "~/Content/metronic_v4.7/theme/assets/global/plugins/bootstrap-growl/jquery.bootstrap-growl.min.js",
                        "~/Scripts/global.js",
                        "~/Content/metronic_v4.7/theme/assets/global/scripts/app.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/gameScripts").Include(
                        "~/Scripts/controllers/RouletteTable.js",
                        "~/Scripts/controllers/RouletteWheel.js",
                        "~/Scripts/controllers/CasinoController.js",
                        "~/Scripts/controllers/GameEngineController.js"
                        ));







            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            //BundleTable.EnableOptimizations = true;
        }
    }
}
