using ProjectColor.Api.Models;
using ProjectColor.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:4300")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddScoped<ITestService, TestService>();

var app = builder.Build();

app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Test Configuration Endpoints
app.MapGet("/api/v1/tests/config", (ITestService testService) =>
{
    var config = testService.GetTestConfiguration();
    // No DB calls or hookups right now, just console logging to simulate and confirm the frontend api call reaches the backend.
    Console.WriteLine("GET /api/v1/tests/config - returning test configuration");
    return Results.Ok(config);
})
.WithName("GetTestConfiguration");

// Arrangement Test Endpoints
app.MapPost("/api/v1/tests/Arrangement/submit", (ArrangementTestResponse request, ITestService testService) =>
{
    Console.WriteLine($"POST /api/v1/tests/Arrangement/submit - received responses: {request.Responses.Count} plates");
    return Results.Ok(new { received = true });
})
.WithName("SubmitArrangementTest");

// Anomaloscope Test Endpoints
app.MapPost("/api/v1/tests/anomaloscope/submit", (AnomaloscopeTestResponse request, ITestService testService) =>
{
    Console.WriteLine($"POST /api/v1/tests/anomaloscope/submit - received {request.Matches.Count} color matches");
    var result = testService.ScoreTests(request);
    return Results.Ok(result);
})
.WithName("SubmitAnomaloscopeTest");

// Test Result Scoring
app.MapPost("/api/v1/tests/score", (TestScoringRequest request, ITestService testService) =>
{
    Console.WriteLine("POST /api/v1/tests/score - computing final result");
    var result = testService.ComputeFinalResult(request);
    return Results.Ok(result);
})
.WithName("ScoreTest");

app.Run();
