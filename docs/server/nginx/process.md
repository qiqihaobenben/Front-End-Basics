# Nginx 执行流程

## Nginx 启动

### Nginx 启动、退出时的回调方法

- init_module 在 master 进程中调用
- init_process 在 worker 进程中调用
- exit_process 在 worker 进程退出时调用
- exit_master 在 master 进程退出时调用

### Nginx 的启动流程

1. 根据命令行得到配置文件路径
2. 如果处于升级中则监听环境变量里传递的监听句柄
3. 调用所有核心模块的 create_conf 方法生成存放配置项的描述体
4. 针对所有核心模块解析 nginx.conf 配置文件
5. 调用所有核心模块的 init_conf 方法
6. 创建目录、打开文件、初始化共享内存等进程间通信方式
7. 打开由各 Nginx 模块从配置文件中读取到的监听端口
8. 调用所有模块的 init_module 方法（检测 Nginx 的运行方式，单进程还是 master 多进程）
9. 一般会以 master 多进程方式运行 Nginx，进入 master 模式
10. 启动 master 进程
11. 根据 worker_process 启动 worker 进程，调用所有模块的 init_process 方法
12. 启动 cache manager 进程
13. 启动 cache loader 子进程，关闭父进程启动时监听的端口
