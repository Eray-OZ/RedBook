using api.Application.DTOs.Book;
using api.Application.DTOs.ReadingLog;
using api.Application.Mappings;
using api.Core.Interfaces;
using api.Data.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MyApp.Namespace
{
    [Route("api/logs")]
    [ApiController]
    public class ReadingLogController : ControllerBase
    {
        private readonly IReadingLogRepo _logRepo;

        public ReadingLogController(IReadingLogRepo logRepo)
        {
            _logRepo = logRepo;
        }




        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var logs = await _logRepo.GetAllAsync();
            var logsDto = logs.Select(l => l.ToLogDto());
            return Ok(logsDto);
        }



        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateLogDto logDto)
        {
            var logEntity = logDto.ToLogFromCreateDto();
            await _logRepo.CreateAsync(logEntity);

            return Ok(logEntity);   
        }



    }
}
