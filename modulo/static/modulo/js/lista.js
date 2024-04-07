export default class ListaView {
    constructor(modelo, contenedor, url) {
        this.url = url;
        this.contenedor = contenedor;
        this.modelo = modelo;
        this.formulario = document.getElementById("formModal");
        this.modal = document.getElementById("modalForm");
        this.view = null;
        this.post_modal = () => {
        };
        this.post_cargar_lista = () => {
        };
        this.error_submit = () => {
        };
        this.submit = (ev) => this.modelo.onSubmit(ev, this.contenedor, this.formulario, this.modal).then(resultado => {
            if (resultado.estado) {
                this.set_per_paginator(this.eliminar)
                this.reload_table()
            } else {
                this.error_submit();
            }
            return resultado;
        });


        this.pagination = "5"
        this.pagina = "";
        this.buscar = "";
        this.cargar_lista(this.url);

        this.click_row_select = () => {
        }
        this.eliminar = false;
    }

    reload_table = () => {
        const by_pagination = this.contenedor.querySelector('#by_pagination')
        const txtBuscar = this.contenedor.querySelector("#txtBuscar");
        if (by_pagination) {
            this.pagination = by_pagination.value
        }
        let search = null;
        if (txtBuscar) {
            if (txtBuscar.value) {
                search = ("&" + "search=" + txtBuscar.value);
            }
        }
        this.cargar_lista(this.url + (this.pagina ? this.pagina : '?') + '&pagination=' + this.pagination + (search ? search : ""))
    }

    cargar_lista(url) {
        this.modelo.getUrlContenedor(url, this.contenedor).then(() => {
            const btnActualizar = this.contenedor.querySelector("#btnActualizar");
            if (btnActualizar) {
                btnActualizar.addEventListener("click", evt => {
                    this.reload_table()
                })
            }
            this.set_per_paginator(false);
            this.search(this.url);
            this.paginar(this.url);
            this.paginacion(this.url);
            this.post_cargar_lista();
            this.selected((r) => this.click_row_select(r));
        }).catch(error => {
            console.error(error)
            this.contenedor.hideloader();
        })
    }

    /**
     * open_modal
     * options = {
     *     modal_lg : true or modal_xl : true or modal_sm : true
     * }
     * */
    open_modal(url, titulo, options = {}) {
        this.reload_table()
        if (options.modal_lg) {
            this.modal.querySelector(".modal-dialog").classList.add("modal-lg");
        } else if (options.modal_xl) {
            this.modal.querySelector(".modal-dialog").classList.add("modal-xl");
        } else if (options.modal_sm) {
            this.modal.querySelector(".modal-dialog").classList.add("modal-sm");
        } else {
            this.modal.querySelector(".modal-dialog").classList.remove("modal-xl", "modal-lg", "modal-sm");
        }
        this.contenedor.showloader();
        this.modelo.openModal(this.modal, this.formulario, url, titulo).then(() => this.post_modal());
    }

    search(url) {
        const by_pagination = this.contenedor.querySelector('#by_pagination')
        const txtBuscar = this.contenedor.querySelector("#txtBuscar");
        if (txtBuscar) {
            // txtBuscar.focus();
            txtBuscar.addEventListener("keypress", ev => {
                if (ev.key === "Enter") {
                    this.cargar_lista(url + ("?pagination=" + (by_pagination ? by_pagination.value : "") + "&search=" + txtBuscar.value));
                    this.buscar = txtBuscar.value;
                    this.pagina = "";
                }
            })
            txtBuscar.value = this.buscar;
        }
    }

    paginacion(url) {
        const txtBuscar = this.contenedor.querySelector("#txtBuscar");
        const pages = this.contenedor.querySelectorAll(".paginacion");
        let search = null;
        if (txtBuscar) {
            if (txtBuscar.value) {
                search = ("&search=" + txtBuscar.value);
            }
        }

        if (pages) {
            pages.forEach(element => {
                element.addEventListener("click", evt => {
                    this.cargar_lista(url + (element.dataset.page ? element.dataset.page : "?") + ("&pagination=" + this.pagination) + (search ? search : ""))
                    this.pagina = element.dataset.page;
                })
            })
        }
    }

    selected(f) {
        const rows = this.contenedor.querySelectorAll("tr[data-pk]");
        if (rows) {
            rows.forEach(element => {
                element.addEventListener("click", () => {
                    rows.forEach(element => {
                        element.classList.remove("select-active")
                    })
                    element.classList.add("select-active")
                    f(element.dataset.pk)
                });
            })
        }
    }

    botones(url_crear = "", url_editar = "", url_eliminar = "", titulo, options = {}) {
        const btnAgregar = this.contenedor.querySelector("#btnAgregar");
        const btnEditar = this.contenedor.querySelectorAll(".btnEditar");
        const btnEliminar = this.contenedor.querySelectorAll(".btnEliminar");
        if (btnAgregar) {
            this.boton_modal(btnAgregar, url_crear, "Nuevo " + titulo, options)
        }
        if (btnEditar) {
            btnEditar.forEach(element => {
                this.boton_modal(element, url_editar.replace("/0", "/" + element.dataset.pk), "Editar " + titulo, options)
            })
        }
        if (btnEliminar) {
            btnEliminar.forEach(element => {
                this.boton_modal(element, url_eliminar.replace("/0", "/" + element.dataset.pk), "Eliminar " + titulo, options, true)
            })
        }
    }

    boton_modal(element, url, titulo, options = {}, eliminar = false) {
        element.onclick = () => {
            this.eliminar = eliminar;
            if (url) {
                this.open_modal(url, titulo, options);
            }
        }
    }

    paginar(url) {
        const by_pagination = this.contenedor.querySelector('#by_pagination')
        const txtBuscar = this.contenedor.querySelector("#txtBuscar");

        if (by_pagination) {
            by_pagination.onchange = evt => {
                this.pagination = by_pagination.value
                let url = this.url
                // url += '?pagination=' + this.pagination;
                this.cargar_lista(url + "?" + "pagination=" + this.pagination + ("&search=" + (txtBuscar ? txtBuscar.value : "")))
                // this.pagination = ''
            }
            by_pagination.value = this.pagination;

        }

    }

    set_per_paginator(eliminar = false) {
        const per_paginator_content = this.contenedor.querySelector("#per_paginator")
        if (per_paginator_content) {
            const per_paginator = JSON.parse(per_paginator_content.textContent)
            if (this.pagination) {
                this.pagination = per_paginator.per_paginator
            }
            if (eliminar) {
                if (per_paginator.start_index === per_paginator.end_index && per_paginator.num_pages > 1) {
                    this.pagina = "?page=" + (per_paginator.num_pages - 1)
                }
            }

        }
    }


}

