package com.sunnymix.flylint.api.model.wiki;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

/**
 * @author sunnymix
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateWiki {

    @Builder.Default
    private Optional<String> title = Optional.empty();

    @Builder.Default
    private Optional<String> content = Optional.empty();

}
