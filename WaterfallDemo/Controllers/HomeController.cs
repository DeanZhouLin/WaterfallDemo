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
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "瀑布流布局Demo-参考资料：";

            return View();
        }

        public ActionResult GetWaterfallImageInfos()
        {
            Thread.Sleep(100);
            dynamic requestData = new ExpandoObject();
            requestData.PageNumber = Request["PageNumber"];
            requestData.ImageWidth = Request["ImageWidth"];
            requestData.CurrItemCount = Request["CurrItemCount"];

            int currItemCount = Convert.ToInt32(requestData.CurrItemCount);
            if (currItemCount > 340 && DateTime.Now.Ticks % 2 == 0)
            {
                return Content(null);
            }
            dynamic dyData = new ExpandoObject();
            dyData.photos = new List<ExpandoObject>();
            byte[] buffBytes = new byte[20];
            new Random().NextBytes(buffBytes);
            for (int i = 0; i < 2; i++)
            {
                int ran = buffBytes[i] % 16;
                dynamic dyTemp = new ExpandoObject();
                string path = AppDomain.CurrentDomain.BaseDirectory + "images\\" + ran + ".jpg";
                dyTemp.src = ImageUtil.CropImage(path, Convert.ToInt32(requestData.ImageWidth));
                string src = dyTemp.src.Replace(AppDomain.CurrentDomain.BaseDirectory, "../../");
                dyTemp.src = src;
                StringBuilder sb = new StringBuilder();
                sb.Append("标题");
                for (int j = 0; j < ran; j++)
                {
                    sb.Append("这是第" + i + "张图片，文字循环" + ran + "次");
                }
                dyTemp.title = sb.ToString();
                dyData.photos.Add(dyTemp);
            }
            dyData.pageCount = 8;

            var json = JsonConvert.SerializeObject(dyData);
            return Content(json);
        }
    }

    public static class ImageUtil
    {

        /// <summary>
        /// 按照尺寸裁剪图片
        /// </summary>
        /// <param name="sourcePicPath"></param>
        /// <param name="width"></param>
        /// <param name="height"></param>
        /// <param name="cRate"></param>
        /// <returns></returns>
        public static string CropImage(string sourcePicPath, int width, int height = 0, double cRate = 1d)
        {
            string savePicPath;
            var image = GetImageByPath(sourcePicPath, ref width, out savePicPath);
            if (!File.Exists(savePicPath))
            {
                if (width < image.Width * cRate)
                {
                    double rate = width / (image.Width * cRate);
                    image = AutoZoomImage(image, image.Width * rate, image.Height * rate);
                }

                int startX = (image.Width - width) / 2;
                int iWidth = Math.Min(width, image.Width - startX);
                int startY = 0;
                int iHeight = image.Height;

                var resImage = image.CropImage(startX, startY, iWidth, iHeight);

                image.Dispose();

                string dir = Path.GetDirectoryName(savePicPath);
                if (dir != null && !Directory.Exists(dir))
                    Directory.CreateDirectory(dir);

                resImage.Save(savePicPath);
            }
            return savePicPath;
        }

        /// <summary>
        /// 按照尺寸裁剪图片
        /// </summary>
        /// <param name="sourceImage"></param>
        /// <param name="StartX"></param>
        /// <param name="StartY"></param>
        /// <param name="iWidth"></param>
        /// <param name="iHeight"></param>
        /// <returns></returns>
        private static Image CropImage(this Image sourceImage, int StartX, int StartY, int iWidth, int iHeight)
        {
            if (sourceImage == null)
            {
                return null;
            }
            int w = sourceImage.Width;
            int h = sourceImage.Height;
            if (StartX >= w || StartY >= h)
            {
                return null;
            }
            if (StartX + iWidth > w)
            {
                iWidth = w - StartX;
            }
            if (StartY + iHeight > h)
            {
                iHeight = h - StartY;
            }
            try
            {
                Image bmpOut = new Bitmap(iWidth, iHeight, PixelFormat.Format24bppRgb);
                Graphics g = Graphics.FromImage(bmpOut);
                g.DrawImage(sourceImage, new Rectangle(0, 0, iWidth, iHeight), new Rectangle(StartX, StartY, iWidth, iHeight),
                    GraphicsUnit.Pixel);
                g.Dispose();
                return bmpOut;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// 图片等比缩放
        /// </summary>
        /// <param name="initImage"></param>
        /// <param name="targetWidth">指定的最大宽度</param>
        /// <param name="targetHeight">指定的最大高度</param>
        /// <param name="watermarkText">水印文字(为""表示不使用水印)</param>
        /// <param name="watermarkImage">水印图片路径(为""表示不使用水印)</param>
        /// <returns>缩放后的图片</returns>
        public static Image AutoZoomImage(this Image initImage, Double targetWidth, Double targetHeight, string watermarkText = "", string watermarkImage = "")
        {

            if (initImage.Width == targetWidth && initImage.Height == targetHeight)
            {
                return initImage;
            }

            //原图宽高均小于模版，留白，保存
            if (initImage.Width <= targetWidth && initImage.Height <= targetHeight)
            {
                //缩略图宽、高计算
                double newWidth = initImage.Width;
                double newHeight = initImage.Height;

                double rate = targetHeight / targetWidth;
                double r = newHeight / newWidth;

                if (rate > r)
                {
                    newWidth = targetWidth;
                    newHeight = Convert.ToInt32(targetWidth * r);
                }
                else
                {
                    newHeight = targetHeight;
                    newWidth = Convert.ToInt32(targetHeight / r);
                }

                //生成新图
                //新建一个bmp图片
                Image newImage = new Bitmap((int)newWidth, (int)newHeight);

                //新建一个画板
                Graphics newG = Graphics.FromImage(newImage);

                //设置质量
                newG.InterpolationMode = InterpolationMode.HighQualityBicubic;
                newG.SmoothingMode = SmoothingMode.HighQuality;

                //置背景色
                newG.Clear(Color.White);
                //画图
                newG.DrawImage(initImage, new Rectangle(0, 0, newImage.Width, newImage.Height), new Rectangle(0, 0, initImage.Width, initImage.Height), GraphicsUnit.Pixel);


                //文字水印
                if (watermarkText != "")
                {
                    using (Graphics gWater = Graphics.FromImage(initImage))
                    {
                        Font fontWater = new Font("黑体", 10);
                        Brush brushWater = new SolidBrush(Color.White);
                        gWater.DrawString(watermarkText, fontWater, brushWater, 10, 10);
                        gWater.Dispose();
                    }
                }
                //透明图片水印
                if (watermarkImage != "")
                {
                    if (System.IO.File.Exists(watermarkImage))
                    {
                        //获取水印图片
                        using (Image wrImage = Image.FromFile(watermarkImage))
                        {
                            //水印绘制条件：原始图片宽高均大于或等于水印图片
                            if (initImage.Width >= wrImage.Width && initImage.Height >= wrImage.Height)
                            {
                                Graphics gWater = Graphics.FromImage(initImage);
                                //透明属性
                                ImageAttributes imgAttributes = new ImageAttributes();
                                ColorMap colorMap = new ColorMap
                                {
                                    OldColor = Color.FromArgb(255, 0, 255, 0),
                                    NewColor = Color.FromArgb(0, 0, 0, 0)
                                };

                                ColorMap[] remapTable = { colorMap };
                                imgAttributes.SetRemapTable(remapTable, ColorAdjustType.Bitmap);
                                float[][] colorMatrixElements = { 
                                   new[] {1.0f,  0.0f,  0.0f,  0.0f, 0.0f},
                                   new[] {0.0f,  1.0f,  0.0f,  0.0f, 0.0f},
                                   new[] {0.0f,  0.0f,  1.0f,  0.0f, 0.0f},
                                   new[] {0.0f,  0.0f,  0.0f,  0.5f, 0.0f},//透明度:0.5
                                   new[] {0.0f,  0.0f,  0.0f,  0.0f, 1.0f}
                                };
                                ColorMatrix wmColorMatrix = new ColorMatrix(colorMatrixElements);
                                imgAttributes.SetColorMatrix(wmColorMatrix, ColorMatrixFlag.Default, ColorAdjustType.Bitmap);
                                gWater.DrawImage(wrImage, new Rectangle(initImage.Width - wrImage.Width, initImage.Height - wrImage.Height, wrImage.Width, wrImage.Height), 0, 0, wrImage.Width, wrImage.Height, GraphicsUnit.Pixel, imgAttributes);
                                gWater.Dispose();
                            }
                            wrImage.Dispose();
                        }
                    }
                }

                Image targetImage = new Bitmap((int)targetWidth, (int)targetHeight);
                Graphics targetG = Graphics.FromImage(targetImage);
                int x = (int)((targetWidth - newImage.Width) / 2);
                int y = (int)((targetHeight - newImage.Height) / 2);
                targetG.Clear(Color.White);
                targetG.DrawImage(newImage, new Rectangle(x, y, newImage.Width, newImage.Height), new Rectangle(0, 0, newImage.Width, newImage.Height), GraphicsUnit.Pixel);

                //释放资源
                targetG.Dispose();
                newG.Dispose();
                newImage.Dispose();
                initImage.Dispose();

                return targetImage;
            }
            else
            {
                //缩略图宽、高计算
                double newWidth = initImage.Width;
                double newHeight = initImage.Height;

                double rate = targetHeight / targetWidth;
                double r = newHeight / newWidth;

                if (rate > r)
                {
                    newWidth = targetWidth;
                    newHeight = Convert.ToInt32(targetWidth * r);
                }
                else
                {
                    newHeight = targetHeight;
                    newWidth = Convert.ToInt32(targetHeight / r);
                }

                //生成新图
                //新建一个bmp图片
                Image newImage = new Bitmap((int)newWidth, (int)newHeight);

                //新建一个画板
                Graphics newG = Graphics.FromImage(newImage);
                //设置质量
                newG.InterpolationMode = InterpolationMode.HighQualityBicubic;
                newG.SmoothingMode = SmoothingMode.HighQuality;
                //置背景色
                newG.Clear(Color.White);
                //画图
                newG.DrawImage(initImage, new Rectangle(0, 0, newImage.Width, newImage.Height), new Rectangle(0, 0, initImage.Width, initImage.Height), GraphicsUnit.Pixel);

                //文字水印
                if (watermarkText != "")
                {
                    using (Graphics gWater = Graphics.FromImage(newImage))
                    {
                        Font fontWater = new Font("黑体", 10);
                        Brush brushWater = new SolidBrush(Color.White);
                        gWater.DrawString(watermarkText, fontWater, brushWater, 10, 10);
                        gWater.Dispose();
                    }
                }
                //透明图片水印
                if (watermarkImage != "")
                {
                    if (System.IO.File.Exists(watermarkImage))
                    {
                        //获取水印图片
                        using (Image wrImage = Image.FromFile(watermarkImage))
                        {
                            //水印绘制条件：原始图片宽高均大于或等于水印图片
                            if (newImage.Width >= wrImage.Width && newImage.Height >= wrImage.Height)
                            {
                                Graphics gWater = Graphics.FromImage(newImage);
                                //透明属性
                                ImageAttributes imgAttributes = new ImageAttributes();
                                ColorMap colorMap = new ColorMap
                                {
                                    OldColor = Color.FromArgb(255, 0, 255, 0),
                                    NewColor = Color.FromArgb(0, 0, 0, 0)
                                };
                                ColorMap[] remapTable = { colorMap };
                                imgAttributes.SetRemapTable(remapTable, ColorAdjustType.Bitmap);
                                float[][] colorMatrixElements = { 
                                   new[] {1.0f,  0.0f,  0.0f,  0.0f, 0.0f},
                                   new[] {0.0f,  1.0f,  0.0f,  0.0f, 0.0f},
                                   new[] {0.0f,  0.0f,  1.0f,  0.0f, 0.0f},
                                   new[] {0.0f,  0.0f,  0.0f,  0.5f, 0.0f},//透明度:0.5
                                   new[] {0.0f,  0.0f,  0.0f,  0.0f, 1.0f}
                                };
                                ColorMatrix wmColorMatrix = new ColorMatrix(colorMatrixElements);
                                imgAttributes.SetColorMatrix(wmColorMatrix, ColorMatrixFlag.Default, ColorAdjustType.Bitmap);
                                gWater.DrawImage(wrImage, new Rectangle(newImage.Width - wrImage.Width, newImage.Height - wrImage.Height, wrImage.Width, wrImage.Height), 0, 0, wrImage.Width, wrImage.Height, GraphicsUnit.Pixel, imgAttributes);
                                gWater.Dispose();
                            }
                            wrImage.Dispose();
                        }
                    }
                }

                Image targetImage = new Bitmap((int)targetWidth, (int)targetHeight);
                Graphics targetG = Graphics.FromImage(targetImage);
                int x = (int)((targetWidth - newImage.Width) / 2);
                int y = (int)((targetHeight - newImage.Height) / 2);
                targetG.Clear(Color.White);
                targetG.DrawImage(newImage, new Rectangle(x, y, newImage.Width, newImage.Height), new Rectangle(0, 0, newImage.Width, newImage.Height), GraphicsUnit.Pixel);

                //释放资源
                targetG.Dispose();
                newG.Dispose();
                newImage.Dispose();
                initImage.Dispose();

                return targetImage;
            }
        }

        /// <summary>
        /// 根据源图片的地址获取Image对象
        /// </summary>
        /// <param name="sourcePicPath"></param>
        /// <param name="width"></param>
        /// <param name="savePicPath"></param>
        /// <returns></returns>
        private static Image GetImageByPath(string sourcePicPath, ref int width, out string savePicPath)
        {
            //获取图片对象
            var resImage = Image.FromStream(File.OpenRead(sourcePicPath), true);
            //获取图片的宽
            width = Math.Min(width, resImage.Width);
            //图片的保存地址（如果需要对源图进行切割，切割后的图片存放在此位置）
            savePicPath = Path.GetDirectoryName(sourcePicPath) + "\\" + width + "\\" + Path.GetFileName(sourcePicPath);
            //返回图片对象
            return resImage;
        }

    }

}
