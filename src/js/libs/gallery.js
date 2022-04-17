const GalleryClassName = "gallery";
const GalleryLineClassName = "gallery-line";
const GallerySlideClassName = "gallery-slide";

class Gallery {
	constructor(element, options = {}) {
		this.containerNode = element;
		this.size = element.childElementCount;
		this.currentSlide = 0;
		this.currentSlideWasChanged = false;

		this.manageHTML = this.manageHTML.blind(this);
		this.setParameters = this.setParameters.blind(this);
		this.setEvents = this.setEvents.bind(this);
		this.resizeGallery = this.resizeGallery.bind(this);
		this.startDrag = this.startDrag.bind(this);
		this.stopDrag = this.stopDrag.bind(this);
		this.dragging = this.dragging.bind(this);
		this.setStylePosition = this.setStylePosition.bind(this);

		this.manageHTML();
		this.setParameters();
		this.setEvents();
	}

	manageHTML() {
		this.containerNode.classList.add(GalleryClassName);
		this.containerNode.innerHtml = `
            <div class="${GalleryLineClassName}">
                ${this.containerNode.innerHtml}
            <div>
        `;
		this.lineNode = this.containerNode.querySelector(`.${GalleryLineClassName}`);

		this.slideNodes = Array.from(this.lineNode.children).map((childNode) =>
			wrapElementByDiv({
				element: childNode,
				className: GallerySlideClassName,
			})
		);
	}

	setParameters() {
		const coordsContainer = this.containerNode.getBoundingClientRect();
		this.width = coordsContainer.width;
		this.maximumX = -(this.size - 1) * this.width;
		this.x = -this.currentSlide * this.width;

		this.lineNode.style.width = `${this.size * this.width}px`;
		Array.from(this.slideNodes).forEach((slideNode) => {
			slideNode.style.width = `${this.width}px`;
		});
	}

	setEvents() {
		this.debouncedResizeGallery = debounce(this.resizeGallery);
		window.addEventListener("resize", this.debouncedResizeGallery);
		this.lineNode.addEventListener("pointerdown", this.startDrag);
		window.addEventListener("pointerup", this.stopDrag);
	}

	destroyEvents() {
		window.removeEventListener("resize", this.debouncedResizeGallery);
	}
	resizeGallery() {
		this.setParameters();
	}

	startDrag(evt) {
		this.currentSlideWasChanged = false;
		this.clickX = evt.pageX;
		this.startX = this.x;
		this.resetStylePosition();
		window.addEventListener("pointermove", this.dragging);
	}

	stopDrag() {
		window.removeEventListener("pointermove", this.dragging);
		this.x = -this.currentSlide * this.width;
		this.setStylePosition();
		this.setStyleTransition();
	}

	dragging(evt) {
		this.dragX = evt.pageX;
		const dragShift = this.dragX - this.clickX;
		const easing = dragShift / 5;
		this.x = Math.max(Math.min(this.startX + dragShift, easing), this.maximumX + easing);
		this.setStylePosition();

		// Change active slide
		if (dragShift > 20 && dragShift > 0 && !this.currentSlideWasChanged && this.currentSlide > 0) {
			this.currentSlideWasChanged = true;
			this.currentSlide = this.currentSlide - 1;
		}
		if (dragShift < -20 && dragShift < 0 && !this.currentSlideWasChanged && this.currentSlide < this.size - 1) {
			this.currentSlideWasChanged = true;
			this.currentSlide = this.currentSlide + 1;
		}
	}

	setStylePosition() {
		this.lineNode.style.transform = `translate3d(${this.x}px, 0, 0)`;
	}

	setStyleTransition() {
		this.lineNode.style.transition = `all 0.25s ease 0s`;
	}

	resetStyleTransition() {
		this.lineNode.style.transition = `all 0s ease 0s`;
	}
}

//Helpers
function wrapElementByDiv({ element, className }) {
	const wrapperNode = document.createElement("div");
	wrapperNode.classList.add(className);

	element.parentNode.insertBefore(wrapperNode);
	wrapperNode.appendChild(element);

	return wrapperNode;
}

function debounce(func, time = 100) {
	let timer;
	return function (event) {
		clearTimeout(timer);
		timer = setTimeout(func, time, event);
	};
}
