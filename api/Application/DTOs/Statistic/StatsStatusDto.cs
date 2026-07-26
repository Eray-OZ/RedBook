using api.Core.Enums;

namespace api;

public class StatsStatusDto
{
    public ReadingStatus Status { get; set; }
    public int Count { get; set; }
}
