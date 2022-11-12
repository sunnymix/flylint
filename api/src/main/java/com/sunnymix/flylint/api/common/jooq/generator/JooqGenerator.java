package com.sunnymix.flylint.api.common.jooq.generator;

import org.jooq.codegen.DefaultGeneratorStrategy;
import org.jooq.meta.CatalogDefinition;
import org.jooq.meta.Definition;
import org.jooq.meta.SchemaDefinition;
import org.jooq.tools.StringUtils;

/**
 * @author sunnymix
 */
public class JooqGenerator extends DefaultGeneratorStrategy {

    @Override
    public String getJavaClassName(Definition definition, Mode mode) {
        String fixedName = getFixedJavaClassName(definition);

        if (fixedName != null) {
            return fixedName;
        }

        return getJavaClassName0(definition.getOutputName(), mode);
    }

    protected String getFixedJavaClassName(Definition definition) {
        // [#2032] Intercept default catalog
        if (definition instanceof CatalogDefinition && ((CatalogDefinition) definition).isDefaultCatalog()) {
            return "DefaultCatalog";
        }

        // [#2089] Intercept default schema
        if (definition instanceof SchemaDefinition && ((SchemaDefinition) definition).isDefaultSchema()) {
            return "DefaultSchema";
        }

        return null;
    }

    protected String getJavaClassName0(String outputName, Mode mode) {
        StringBuilder result = new StringBuilder();
        // [#4562] Some characters should be treated like underscore
        result.append(StringUtils.toCamelCase(
            outputName.replace(' ', '_')
                .replace('-', '_')
                .replace('.', '_')
        ));

        if (mode == Mode.RECORD)
            result.append("Record");
        else if (mode == Mode.DAO)
            result.append("Dao");
        else if (mode == Mode.INTERFACE)
            result.insert(0, "I");
        else if (mode == Mode.POJO)
            result.append("Po");

        return result.toString();
    }

}
