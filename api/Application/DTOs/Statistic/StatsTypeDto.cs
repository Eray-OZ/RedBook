using api.Core.Enums;

namespace api.Application.DTOs.Statistic;

public class StatsTypeDto
{
    public ItemType ItemType { get; set; }
    public int Count { get; set; }
}
