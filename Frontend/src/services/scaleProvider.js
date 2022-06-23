import { discontinuousTimeScaleProviderBuilder } from "react-financial-charts";

const scaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
    (d) => new Date(d.time)
);

export default scaleProvider