using System;
using System.Collections.Generic;
using System.Web.Mvc;
using WaterfallDemo.Models;

namespace WaterfallDemo.Controllers
{
    public class MasonryHeadViewController : Controller
    {
        //
        // GET: /MasonryHeadView/

        public ActionResult Index()
        {

            return PartialView("MasonryHeadViewPartical");
        }


       
    }
}
