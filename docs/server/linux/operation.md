# Linux 服务器运维

## 性能

### 查看使用内存最多的 10 个进程

```bash

ps aux | sort -nrk 4 | head

```
