package cn.com.hatech.generator;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("cn.com.hatech.generator.dao")
public class HatechGeneratorApplication {

	public static void main(String[] args) {
		SpringApplication.run(HatechGeneratorApplication.class, args);
	}
}
