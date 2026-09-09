using ProjectColor.Api.Models;

namespace ProjectColor.Api.Services;

public class TestService : ITestService
{
    public TestConfiguration GetTestConfiguration()
    {
        Console.WriteLine("[TestService] GetTestConfiguration called");

        return new TestConfiguration
        {
            IshihiraPlateCount = 38,
            AnomaloscopeColors = new List<AnomaloscopeColor>
            {
                new AnomaloscopeColor
                {
                    Id = 1,
                    Name = "Rayleigh Red-Green",
                    Axis = "red-green",
                    ReferenceHue = 60,
                    ReferenceSaturation = 50,
                    ReferenceIntensity = 50
                },
                new AnomaloscopeColor
                {
                    Id = 2,
                    Name = "Moreland Blue-Yellow",
                    Axis = "blue-yellow",
                    ReferenceHue = 240,
                    ReferenceSaturation = 50,
                    ReferenceIntensity = 50
                }
            },
            Version = "1.0"
        };
    }

    public TestResult ScoreTests(AnomaloscopeTestResponse anomaloscopeResponse)
    {
        Console.WriteLine($"[TestService] ScoreTests called with {anomaloscopeResponse.Matches.Count} matches");

        // Placeholder scoring logic - will be enhanced based on open questions
        bool hasDeficiency = anomaloscopeResponse.Matches.Any(m =>
            Math.Abs(m.MatchedSaturation - 50) > 15);

        return new TestResult
        {
            HasDeficiency = hasDeficiency,
            Classification = hasDeficiency ? "Anomalous Trichromacy (Deuteranomaly)" : "Normal Trichromacy",
            PlainLanguageExplanation = hasDeficiency
                ? "Your test results suggest you may have a form of color vision deficiency."
                : "Your test results are consistent with normal color vision.",
            TestedAt = DateTime.UtcNow
        };
    }

    public TestResult ComputeFinalResult(TestScoringRequest request)
    {
        Console.WriteLine("[TestService] ComputeFinalResult called");

        // Combine both test results
        if (request.AnomaloscopeResponses != null)
        {
            return ScoreTests(request.AnomaloscopeResponses);
        }

        return new TestResult
        {
            HasDeficiency = false,
            Classification = "Normal Trichromacy",
            PlainLanguageExplanation = "No deficiency detected.",
            TestedAt = DateTime.UtcNow
        };
    }
}
