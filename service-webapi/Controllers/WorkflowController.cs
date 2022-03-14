using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Service.Workflows.Data;
using Service.Workflows.Persistence;
using WorkflowCore.Interface;
using WorkflowCore.Models;
using WorkflowCore.Models.Search;

namespace service_webapi.Controllers
{
    public class CustomData {
        public string code;
    }
    [EnableCors]
    [ApiController]
    [Route("api/[controller]")]
    public class WorkflowController : ControllerBase
    {
        private readonly IWorkflowController _workflowService;
        private readonly IWorkflowRegistry _registry;
        private readonly IPersistenceProvider _workflowStore;
        private readonly ISearchIndex _searchService;
        
        private readonly IWorkflowHost _workflowHost;

        private readonly ILogger<WorkflowController> _logger;

        public WorkflowController(IWorkflowController workflowService, ISearchIndex searchService, IWorkflowRegistry registry, IPersistenceProvider workflowStore, IWorkflowHost workflowHost)
        {
            _workflowService = workflowService;
            _workflowStore = workflowStore;
            _registry = registry;
            _searchService = searchService;
            _workflowHost = workflowHost;
        }

        [HttpGet("{id}")]
        public async Task<WorkflowInstance> Get(string id)
        {
            var result = await _workflowStore.GetWorkflowInstance(id);
            return result;
        }

        [HttpPost("{id}")]
        [HttpPost("{id}/{version}")]
        //public async Task<string> Post(string id, int? version, [FromBody]CustomData data)
        //public async Task<string> Post(string id, int? version, [FromBody]JObject data)
        public async Task<string> Post(string id, int? version)//, [FromBody]JObject data)
        {
            string body = string.Empty;
            using (StreamReader stream = new StreamReader(HttpContext.Request.Body))
            {
                body = stream.ReadToEndAsync().Result;
                // body = "param=somevalue&param2=someothervalue"
            }


            
            string workflowId = null;
            var def = _registry.GetDefinition(id, version);
            if (def == null)
                return String.Format("Workflow defintion {0} for version {1} not found", id, version);

            //to be done
            var data = JsonConvert.DeserializeObject(body, def.DataType); //new WorkflowData() { Comment="hello", Requestor="Andy.Hu", Finance="Jessy.Ge", Amount=10000 };
            
            // if ((data != null) && (def.DataType != null))
            // {
            //     var dataStr = JsonConvert.SerializeObject(data);
            //     var dataObj = JsonConvert.DeserializeObject(dataStr, def.DataType);
            //     workflowId = await _workflowService.StartWorkflow(id, version, dataObj, reference);
            // }
            // else
            // {
            //     workflowId = await _workflowService.StartWorkflow(id, version, null, reference);
            // }

            workflowId = await _workflowService.StartWorkflow(id, version, data);

            return workflowId;
        }

        [HttpPut("{id}/suspend")]
        public Task<bool> Suspend(string id)
        {
            return _workflowService.SuspendWorkflow(id);
        }

        [HttpPut("{id}/resume")]
        public Task<bool> Resume(string id)
        {
            return _workflowService.ResumeWorkflow(id);
        }

        [HttpDelete("{id}")]
        public Task<bool> Terminate(string id)
        {
            return _workflowService.TerminateWorkflow(id);
        }

        [HttpGet("instance/all")]
        public Task<List<WorkflowData>> GetAllInstances()
        {
            return Task.Run(()=>{
                return Cache.WFInstances.OrderByDescending(ins=>ins.CreatedAt).ToList();
            });
        }

        [HttpGet("approve/pending/{principle}")]
        public Task<List<WorkflowData>> GetAllInstances(string principle)
        {
            return Task.Run(()=>{
                return Cache.WFInstances.Where(ins => ins.Finance==principle && ins.Status==WorkflowStatus.Runnable)
                .OrderByDescending(ins=>ins.CreatedAt).ToList();
            });
        }

        //审核一个流程实例
        [HttpGet("approve/{id}")]
        public bool Approve(string id)
        {
            var openItems = _workflowHost.GetOpenUserActions(id);
            foreach (var item in openItems)
            {
                string key = item.Key;
                string value = item.Options.Single(x => x.Value == "yes").Value;
                _workflowHost.PublishUserAction(key, @"domain\john", value).Wait();
            }

            return true;
        }

               //审核一个流程实例
        [HttpGet("reject/{id}")]
        public bool Reject(string id)
        {
            var openItems = _workflowHost.GetOpenUserActions(id);
            foreach (var item in openItems)
            {
                string key = item.Key;
                string value = item.Options.Single(x => x.Value == "no").Value;
                _workflowHost.PublishUserAction(key, @"domain\john", value).Wait();
            }

            return true;
        }
    }
}
