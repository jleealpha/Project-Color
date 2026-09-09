using ProjectColor.Api.Models;

namespace ProjectColor.Api.Services;

public interface ITestService
{
    TestConfiguration GetTestConfiguration();
    TestResult ScoreTests(AnomaloscopeTestResponse anomaloscopeResponse);
    TestResult ComputeFinalResult(TestScoringRequest request);
}
