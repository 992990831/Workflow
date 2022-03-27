using System;
using System.Linq;
using System.Threading.Tasks;
using Service.Workflows.Data;
using Service.Workflows.Persistence;
using WorkflowCore.Interface;
using WorkflowCore.Models;

namespace Service.Workflows.Steps
{
    public class StartStep : StepBodyAsync
    {
        public string Requestor { get; set; }

        public string Comment { get; set; }

        public string Output { get; set; }


        public override async Task<ExecutionResult> RunAsync(IStepExecutionContext context)
        {            
            var data = context.Workflow.Data as WorkflowData;
            var node = new Data.WorkflowData(){
                WFName = context.Workflow.WorkflowDefinitionId,
                WFInstanceId = context.Workflow.Id,
                WFInstanceNo = DateTime.Now.ToString("yyyyMMdd") + Cache.WFInstances.Count+1,
                Comment = data.Comment,
                Requestor = data.Requestor,
                Finance = data.Finance,
                Amount = data.Amount,
                CreatedAt = DateTime.Now,
            };

            node.steps.Add(new Data.WorkflowStep() {
                name= "Start Workflow",
                approver = "Andy Hu",
                comment = "Submit Request"
            });

            Cache.WFInstances.Add(node);

            Output = "done";
            return ExecutionResult.Next();
        }
    }
}
