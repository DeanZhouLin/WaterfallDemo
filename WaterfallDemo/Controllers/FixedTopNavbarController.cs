using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WaterfallDemo.Models;

namespace WaterfallDemo.Controllers
{
    public class FixedTopNavbarController : Controller
    {
        //
        // GET: /FixedTopNavbar/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult MasonryHeadViewPartical()
        {
            var list = new List<MasonryHeadView>();

            byte[] buffBytes = new byte[500];
            new Random().NextBytes(buffBytes);

            for (int i = 0; i < 20; i++)
            {
                var mhv = new MasonryHeadView
                {
                    ViewCssClasss = "col-xs-6 col-sm-6 col-md-4 col-lg-3",
                    AHref = "http://www.baidu.com",
                    ATitle = "这里是ATitl"
                };

                int ran = buffBytes[i] % 16;
                mhv.ImageInfo.Src = "../images/" + ran + ".jpg";

                mhv.ImageInfo.Alt = "This is Alt" + i;
                dynamic t = new System.Dynamic.ExpandoObject();
                t.Css = "visible-md visible-lg";
                t.Header = "冯诺尔曼结构";
                t.HeaderSmall = "冯诺尔曼结构";
                mhv.CaptionHeader.Add("h3", t);
                t = new System.Dynamic.ExpandoObject();
                t.Css = "visible-sm visible-xs";
                t.Header = "冯诺尔曼结构";
                t.HeaderSmall = "冯诺尔曼结构";
                mhv.CaptionHeader.Add("h5", t);

                t = new System.Dynamic.ExpandoObject();
                t.Css = "visible-md visible-lg";
                t.Content = " 也称普林斯顿结构，是一种将程序指令存储器和理位置";
                mhv.CaptionContent.Add("p1", t);
                t = new System.Dynamic.ExpandoObject();
                t.Css = "visible-sm visible-xs";
                t.Content = " 也称普林斯顿结构";
                mhv.CaptionContent.Add("p2", t);

                list.Add(mhv);
            }

            return PartialView("../MasonryHeadView/MasonryHeadViewPartical", list);
        }
    }
}
