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
    public class WaterfallController : Controller
    {
        public ActionResult WaterfallUseFixedTemplete()
        {
            return View();
        }

        public ActionResult GetWaterfallImageInfos1()
        {
            Thread.Sleep(300);
            const int getCount = 30;

            dynamic requestData = new ExpandoObject();
            requestData.PageNumber = Request["PageNumber"];
            requestData.ImageWidth = Request["ImageWidth"];
            requestData.CurrItemCount = Request["CurrItemCount"];
            requestData.ScrollTop = Request["ScrollTop"];

            int currItemCount = Convert.ToInt32(requestData.CurrItemCount);
            if (currItemCount > 340 && DateTime.Now.Ticks % 2 == 0)
            {
                return Content(null);
            }
            dynamic dyData = new ExpandoObject();
            dyData.photos = new List<ExpandoObject>();
            byte[] buffBytes = new byte[50];
            new Random().NextBytes(buffBytes);
            for (int i = 0; i < getCount; i++)
            {
                int ran = buffBytes[i] % 16;
                dynamic dyTemp = new ExpandoObject();
                string path = AppDomain.CurrentDomain.BaseDirectory + "images\\" + ran + ".jpg";
                dyTemp.bigSrc = path;
                string bigSrc = dyTemp.bigSrc.Replace(AppDomain.CurrentDomain.BaseDirectory, "../../");
                dyTemp.bigSrc = bigSrc;
                dyTemp.src = ImageUtil.CropImage(path, Convert.ToInt32(requestData.ImageWidth));
                string src = dyTemp.src.Replace(AppDomain.CurrentDomain.BaseDirectory, "../../");
                dyTemp.src = src;
                StringBuilder sb = new StringBuilder();
                sb.Append("标题");
                for (int j = 0; j < ran / 3; j++)
                {
                    sb.Append("这是第" + i + "张图片，文字循环" + ran + "次");
                }
                dyTemp.title = sb.ToString();
                dyData.photos.Add(dyTemp);
            }
            dyData.pageCount = getCount;
            dyData.scrollTop = requestData.ScrollTop;

            var json = JsonConvert.SerializeObject(dyData);
            return Content(json);
        }
    }

}
