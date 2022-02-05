import { Vue, Component } from 'vue-property-decorator'
import { CacheObserver, ObserverMixinOptions } from "@/../types/Global"
import { getUniqueNumberId } from "@/helpers/base";

@Component
export default class IntersectionObserverMixin extends Vue {
    cacheObservers: Array<CacheObserver> = [];

    $intersectionObserverMixin_setIntersectionObserver(options: ObserverMixinOptions): CacheObserver | null {
        if (!options.el) { return null }

        const observeHandler = (entries: Array<IntersectionObserverEntry>, observer: IntersectionObserver) => entries.forEach((observerEntry: IntersectionObserverEntry) => {
            if (observerEntry.intersectionRatio > 0.5) {
                options.callback(options)
                observer.unobserve(options.el)
                this.cacheObservers = this.cacheObservers.filter(item => !item.el.isEqualNode(options.el))
            }
        })

        const observer = new IntersectionObserver(observeHandler, {
            root: options.root || null,
            rootMargin: options.rootMargin || `0px`,
            threshold: options.threshold || 0.9
        })

        observer.observe(options.el)

        const cachedObserver = {
            id: getUniqueNumberId(+new Date()),
            el: options.el,
            observer
        }
        this.cacheObservers.push(cachedObserver)
        return cachedObserver
    }

    killObserver(cachedObserver: CacheObserver): void {
        cachedObserver.observer.unobserve(cachedObserver.el)
    }

    $intersectionObserverMixin_killObservers(): void {
        this.cacheObservers.forEach((item: CacheObserver) => item.observer.unobserve(item.el))
        this.cacheObservers = []
    }
}
