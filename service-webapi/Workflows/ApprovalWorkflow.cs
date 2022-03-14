using System;
using System.Linq;
using Service.Workflows.Data;
using Service.Workflows.Steps;
using WorkflowCore.Interface;
using WorkflowCore.Models;

namespace Service.Workflows
{
    public class ApprovalWorkflow : IWorkflow<WorkflowData>
    {
        public string Id => "ApprovalWorkflow";
            
        public int Version => 1;
            
        public void Build(IWorkflowBuilder<WorkflowData> builder)
        {
            builder
                .StartWith(context => ExecutionResult.Next())
                .Then<StartStep>()
                .Input(step => step.Comment, data => data.Comment)    
                .Input(step => step.Requestor, data => data.Requestor)    
                .UserTask("Do you approve", data => @"domain\bob")
                    .WithOption("yes", "I approve").Do(then => then
                        .StartWith<ApproveStep>(context => Console.WriteLine("You approved"))
                    )
                    .WithOption("no", "I do not approve").Do(then => then
                        .StartWith<RejectStep>(context => Console.WriteLine("You did not approve"))
                    )
                    .WithEscalation(x => TimeSpan.FromSeconds(300), x => @"domain\frank", action => action
                        .StartWith(context => Console.WriteLine("Escalated task"))
                        .Then(context => Console.WriteLine("Sending notification..."))
                        )
                .Then<EndStep>(context => Console.WriteLine("end"));
        }
    }
}

