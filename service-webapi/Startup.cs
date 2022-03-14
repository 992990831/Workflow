using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Logging;
using WorkflowCore.Interface;
using Swashbuckle.AspNetCore.Swagger;
using Service.Workflows;
using Service.Workflows.Data;

namespace service_webapi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddSwaggerGen(c => c.SwaggerDoc("v1", new OpenApiInfo { Title = "Workflow API", Version = "v1" }));
            services.AddWorkflow();

            // services.AddCors(options =>
            // {
            //     options.AddPolicy("all",
            //         builder =>
            //         {
            //             builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
            //         });
            // });
            services.AddCors(options =>
                {
                    options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                    });
                });             
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseCors("AllowAll");

            app.UseSwagger();            
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Workflow API V1"));

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            var host = app.ApplicationServices.GetService<IWorkflowHost>();
            host.RegisterWorkflow<TestWorkflow, MyDataClass>();
            host.RegisterWorkflow<ApprovalWorkflow, WorkflowData>();
            host.Start();
        }
    }
}
