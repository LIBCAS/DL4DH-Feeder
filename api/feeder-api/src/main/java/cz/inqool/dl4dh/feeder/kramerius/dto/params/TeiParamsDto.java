package cz.inqool.dl4dh.feeder.kramerius.dto.params;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeiParamsDto {

    public enum UdPipeParams {
        n, lemma, pos, msd, join
    }

    public enum NameTagParams {
        a, g, i, m, n, o, p, t
    }

    public enum AltoParams {
        height, width, vpos, hpos
    }

    private UdPipeParams udPipeParams;
    private NameTagParams nameTagParams;
    private AltoParams altoParams;
}
