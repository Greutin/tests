import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

class Paging extends Component {

    render() {
        const page = this.props.page;
        if(!page || !page.totalPages || page.totalPages < 2) return '';

        const {pageNumber} = page.pageable; //0
        const {totalPages} = page; // 4

        let pageList = [];

        const countPages = this.props.countPagesInRow;
        const countAvailablePages = (totalPages < countPages ? totalPages : countPages);
        let offsetPage = 0;
        if(totalPages > countPages) {
            if (pageNumber + Math.floor(countPages / 2) + 1 > totalPages) {
                offsetPage = totalPages - countPages;
            } else {
                offsetPage = pageNumber - Math.floor(countPages / 2);
            }
        }
        offsetPage = offsetPage < 0 ? 0 : offsetPage;
        for(let i = 0; i < countAvailablePages; i++) {
            pageList.push(
                (
                    <PaginationItem key={i} active={(i + offsetPage) === pageNumber}>
                        <PaginationLink onClick={() => this.props.onClick(i + offsetPage)}>
                            {i + 1 + offsetPage}
                        </PaginationLink>
                    </PaginationItem>
                )
            );
        }


        const prevPage = !page.first ? () => this.props.onClick(pageNumber - 1) : () => {};
        const nextPage = !page.last ? () => this.props.onClick(pageNumber + 1) : () => {};

        return (
            <Pagination aria-label="Page navigation example">
                <PaginationItem disabled={page.first} onClick={prevPage}>
                    <PaginationLink previous href="#" />
                </PaginationItem>
                {pageList}
                <PaginationItem disabled={page.last} onClick={nextPage}>
                    <PaginationLink next href="#" />
                </PaginationItem>
            </Pagination>
        );
    }
}

export default Paging;