import psutil
import asyncio
from datetime import datetime

class BotMonitor:
    def __init__(self):
        self.bot_processes = {}
    
    async def monitor_bot(self, bot_id, process):
        while process.poll() is None:
            cpu_percent = psutil.Process(process.pid).cpu_percent()
            memory_info = psutil.Process(process.pid).memory_info()
            
            # Log metrics
            await self.log_metrics(bot_id, {
                'cpu': cpu_percent,
                'memory': memory_info.rss,
                'timestamp': datetime.now()
            })
            
            await asyncio.sleep(60)  # Log every minute
