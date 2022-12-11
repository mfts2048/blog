---
title: "rust 基本使用"
update_time: "2022-08-06"
keyword: "rust"
---

## 要展示 RUST_BACKTRACE=1 报错的详细信息时

> https://blog.csdn.net/wowotuo/article/details/108913397

## Command 使用 powershell，cmd 执行指令

```rust
use std::process::Command;
fn main() {
    // cmd_str可以是从输入流读取或从文件里读取
    let cmd_str: String;
    if cfg!(target_os = "windows") {
        // 这里不用\\而是/的话会被windows认为/tmp的/t是一个option而报错
        cmd_str = "wmic PROCESS WHERE name='LeagueClientUx.exe'".to_string();
    } else {
        cmd_str = "wmic PROCESS WHERE name='LeagueClientUx.exe'".to_string();
    }

    let output = if cfg!(target_os = "windows") {
        Command::new("cmd").arg("/c").arg(cmd_str).output().expect("cmd exec error!")
    } else {
        Command::new("sh").arg("-c").arg(cmd_str).output().expect("sh exec error!")
    };

    let output_str = String::from_utf8_lossy(&output.stdout);
    println!("{}", output_str);
}
```

## rust 创建文件并写入内容

### txt

> https://www.cnblogs.com/jiangbo4444/p/15744074.html