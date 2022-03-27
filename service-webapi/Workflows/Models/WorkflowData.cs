using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;
using WorkflowCore.Interface;
using WorkflowCore.Models;

namespace Service.Workflows.Data
{
    public struct WorkflowStep
    {
        public string name { get; set; }
        public string approver { get; set; }
        public string comment { get; set; }
    }

    public class WorkflowData
    {
        public WorkflowData() {
            this.steps = new List<WorkflowStep>();
        }

        public string WFName { get; set; }

        //流程实例Id
        public string WFInstanceId { get; set; }

        //流程实例序列号
        public string WFInstanceNo { get; set; }

        //流程发起人
        public string Requestor { get; set; }

        //财务审批人
        public string Finance { get; set; }

        public double Amount { get; set; }

        public bool FinanceApproved { get; set; }

        public string FinanceComment { get; set; }

        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; }

        public WorkflowStatus Status { get; set; }

        public List<WorkflowStep> steps {get;set;}
    }
}
