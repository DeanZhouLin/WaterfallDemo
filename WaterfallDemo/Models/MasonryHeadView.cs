using System.Collections.Generic;
using System.Dynamic;

namespace WaterfallDemo.Models
{
    public class MasonryHeadView
    {


        public string ViewCssClasss { get; set; }
        private readonly dynamic _imageInfo = new ExpandoObject();
        public dynamic ImageInfo
        {
            get { return _imageInfo; }
        }

        private readonly Dictionary<string, dynamic> _captionHeader = new Dictionary<string, dynamic>();

        public Dictionary<string, dynamic> CaptionHeader
        {
            get
            {
                return _captionHeader;
            }
        }

        private readonly Dictionary<string, dynamic> _captionContent = new Dictionary<string, dynamic>();

        public Dictionary<string, dynamic> CaptionContent
        {
            get { return _captionContent; }
        }

    }
}