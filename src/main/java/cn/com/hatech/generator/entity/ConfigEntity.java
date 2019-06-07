package cn.com.hatech.generator.entity;

import lombok.Data;

@Data
public class ConfigEntity {
    /**
     * 包路径
     */
    private String packageName;

    /**
     * 模块名
     */
    private String moduleName;
    /**
     * 模块中文名
     */
    private String moduleChineseName;
    /**
     * 作者名
     */
    private String author;
    /**
     * email
     */
    private String email;
    /**
     * 表前缀
     */
    private String tablePrefix;
    /**
     * 需要生成的表名称
     */
    private String[] tables;

}
