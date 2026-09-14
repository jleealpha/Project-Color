namespace ProjectColor.Api.Models;

public class TestConfiguration
{
    public int ArrangementPlateCount { get; set; }
    public List<AnomaloscopeColor> AnomaloscopeColors { get; set; } = new();
    public string Version { get; set; } = "1.0";
}

public class AnomaloscopeColor
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Axis { get; set; } = string.Empty; // "red-green" or "blue-yellow"
    public int ReferenceHue { get; set; }
    public int ReferenceSaturation { get; set; }
    public int ReferenceIntensity { get; set; }
}

public class ArrangementTestResponse
{
    public List<int> Responses { get; set; } = new();
}

public class AnomaloscopeMatch
{
    public int ColorId { get; set; }
    public int MatchedHue { get; set; }
    public int MatchedSaturation { get; set; }
    public int MatchedIntensity { get; set; }
}

public class AnomaloscopeTestResponse
{
    public List<AnomaloscopeMatch> Matches { get; set; } = new();
}

public class TestScoringRequest
{
    public ArrangementTestResponse? ArrangementResponses { get; set; }
    public AnomaloscopeTestResponse? AnomaloscopeResponses { get; set; }
}

public class TestResult
{
    public bool HasDeficiency { get; set; }
    public string Classification { get; set; } = "Normal Trichromacy";
    public string PlainLanguageExplanation { get; set; } = string.Empty;
    public DateTime TestedAt { get; set; }
}
