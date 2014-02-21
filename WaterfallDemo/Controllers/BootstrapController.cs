using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Dynamic;
using System.IO;
using System.Text;
using System.Threading;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace WaterfallDemo.Controllers
{
    public class BootstrapController : Controller
    {
        public ActionResult IndexForBootstrapTest()
        {
            ViewBag.Message = "瀑布流布局Demo(使用Masonry)-参考资料：";
            ViewBag.Url = "http://masonry.desandro.com/";
            return View();
        }

        [HttpPost]
        public ActionResult IndexForBootstrapTest(FormCollection formCollection)
        {
            return View();
        }

        public ActionResult NavbarFixedTop()
        {
            return View();
        }
    }
}
