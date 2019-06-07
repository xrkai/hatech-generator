/**
 * Copyright (c) 2018 人人开源 All rights reserved.
 *
 * https://www.renren.io
 *
 * 版权所有，侵权必究！
 */

package cn.com.hatech.generator.controller;

import cn.com.hatech.generator.entity.ConfigEntity;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import cn.com.hatech.generator.service.SysGeneratorService;
import cn.com.hatech.generator.utils.PageUtils;
import cn.com.hatech.generator.utils.Query;
import cn.com.hatech.generator.utils.R;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

/**
 * 代码生成器
 * 
 * @author Mark sunlightcs@gmail.com
 */
@Controller
@RequestMapping("/sys/generator")
public class SysGeneratorController {
	@Autowired
	private SysGeneratorService sysGeneratorService;
	
	/**
	 * 列表
	 */
	@ResponseBody
	@RequestMapping("/list")
	public R list(@RequestParam Map<String, Object> params){
		PageUtils pageUtil = sysGeneratorService.queryList(new Query(params));
		
		return R.ok().put("page", pageUtil);
	}
	
	/**
	 * 生成代码
	 */
	@PostMapping("/code")
	public void code(@RequestBody ConfigEntity configEntity, HttpServletResponse response) throws IOException{
		byte[] data = sysGeneratorService.generatorCode(configEntity);
		response.reset();  
        response.setHeader("Content-Disposition", "attachment; filename=\"hatech-code.zip\"");
        response.addHeader("Content-Length", "" + data.length);  
        response.setContentType("application/octet-stream; charset=UTF-8");  
        IOUtils.write(data,response.getOutputStream());
	}
}
