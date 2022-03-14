using System;
using System.Linq;
using System.Threading.Tasks;
using Service.Workflows.Data;
using Service.Workflows.Persistence;
using WorkflowCore.Interface;
using WorkflowCore.Models;

namespace Service.Workflows.Steps
{
    public class ApproveStep : StepBodyAsync
    {
        public override async Task<ExecutionResult> RunAsync(IStepExecutionContext context)
        {            
            var wfInstance = Cache.WFInstances.FirstOrDefault(ins => ins.WFInstanceId == context.Workflow.Id);

            if(wfInstance != null)
            {
                wfInstance.FinanceApproved = true;
            }

            return ExecutionResult.Next();
        }
    }
}
