using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TokenAuthAPI.Models
{
    public class User
    {
        public string username { get; set; }
        public string password { get; set; }

        public int UserId { get; set; }
        public string EmailAddress { get; set; }
    }
}
