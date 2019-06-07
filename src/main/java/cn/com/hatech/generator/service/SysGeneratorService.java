/**
 * Copyright (c) 2018 人人开源 All rights reserved.
 * <p>
 * https://www.renren.io
 * <p>
 * 版权所有，侵权必究！
 */

package cn.com.hatech.generator.service;

import cn.com.hatech.generator.entity.ConfigEntity;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import cn.com.hatech.generator.dao.GeneratorDao;
import cn.com.hatech.generator.utils.GenUtils;
import cn.com.hatech.generator.utils.PageUtils;
import cn.com.hatech.generator.utils.Query;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipOutputStream;

/**
 * 代码生成器
 *
 * @author Mark sunlightcs@gmail.com
 */
@Service
public class SysGeneratorService {
    @Autowired
    private GeneratorDao generatorDao;

    public PageUtils queryList(Query query) {
        Page<?> page = PageHelper.startPage(query.getPage(), query.getLimit());
        List<Map<String, Object>> list = generatorDao.queryList(query);

        return new PageUtils(list, (int) page.getTotal(), query.getLimit(), query.getPage());
    }

    public Map<String, String> queryTable(String tableName) {
        return generatorDao.queryTable(tableName);
    }

    public List<Map<String, String>> queryColumns(String tableName) {
        return generatorDao.queryColumns(tableName);
    }

    public byte[] generatorCode(ConfigEntity configEntity) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ZipOutputStream zip = new ZipOutputStream(outputStream);
        String[] tableNames = configEntity.getTables();
        for (String tableName : tableNames) {
            //查询表信息
            Map<String, String> table = queryTable(tableName);
            //查询列信息
            List<Map<String, String>> columns = queryColumns(tableName);
            //生成代码
            try {
                GenUtils.generatorCode(table, columns,configEntity, zip);
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        IOUtils.closeQuietly(zip);
        return outputStream.toByteArray();
    }
}
