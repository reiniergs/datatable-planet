/* eslint-disable lwc/no-rest-parameter */
class MixinBuilder {
    constructor(superclass) {
        this.superclass = superclass;
    }

    // This is a method of the class, not a "with" statement
    with(...mixins) {
        return mixins.reduce((c, mixin) => mixin(c), this.superclass);
    }
}

export default superclass => new MixinBuilder(superclass);
