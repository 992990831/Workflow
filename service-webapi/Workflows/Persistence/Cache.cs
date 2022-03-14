using System;
using System.Linq;
using System.Threading.Tasks;
using WorkflowCore.Interface;
using WorkflowCore.Models;
using Service.Workflows.Data;
using System.Collections.Generic;

namespace Service.Workflows.Persistence
{
    public class Cache
    {
        public static List<WorkflowData> WFInstances = new List<WorkflowData>();
    }
}
