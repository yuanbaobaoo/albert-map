/**
 * JS HTML Element DOM 辅助工具类
 */
export class HTMLElementUtil {
	/**
	 * 获取指定元素的所有兄弟元素
	 * @param element
	 */
	public static selectSiblings(element: Element) {
		let doms: Array<Element> = [];

		// 往下找
		let nextSibling = element.nextElementSibling;
		while (nextSibling) {
			doms.push(nextSibling);
			nextSibling = nextSibling.nextElementSibling;
		}

		// 往上找
		let prevSibling = element.previousElementSibling;
		while (prevSibling) {
			doms.push(prevSibling);
			prevSibling = prevSibling.previousElementSibling;
		}

		return doms;
	}

	/**
	 * 查找指定兄弟节点
	 * @param element
	 * @param styleSelector
	 * @private
	 */
	public static findSiblingDom(element: Element, styleSelector: string): Element | null {
		// 往下找
		let nextSibling = element.nextElementSibling;
		while (nextSibling) {
			if (nextSibling.matches(styleSelector)) {
				return nextSibling;
			}
			nextSibling = nextSibling.nextElementSibling;
		}

		// 往上找
		let prevSibling = element.previousElementSibling;
		while (prevSibling) {
			if (prevSibling.matches(styleSelector)) {
				return prevSibling;
			}
			prevSibling = prevSibling.previousElementSibling;
		}

		// 找不到
		return null;
	}

	/**
	 * 获取指定元素的宽度（包含margin）
	 * @param dom
	 * @private
	 */
	public static getDomWidth(dom: Element) {
		return dom.getBoundingClientRect().width;
	}

	/**
	 * 获取指定元素的高度（包含margin）
	 * @param dom
	 * @private
	 */
	public static getDomHeight(dom: Element) {
		return dom.getBoundingClientRect().height;
	}

	/**
	 * 获取URL参数
	 */
	public static getQueryParams(): Map<string, string> {
		const queryParams = new Map<string, string>();
		const url = new URL(window.location.href);
		url.searchParams.forEach((value, key) => {
			queryParams.set(key, value);
		});
		return queryParams;
	}

}
