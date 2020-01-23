import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'

import Button from 'react-bootstrap/Button'
import Table from '../components/table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { getAllSellers, createSeller } from '../services/seller'

import css from '../css/home.module.css'

const newSellerSchema = Yup.object().shape({
  name: Yup.string().required('This field is required.'),
  company: Yup.string().required('This field is required.'),
})

const Home = () => {
  const [state, setState] = useState({
    modalAdd: false,
    modalUpdate: false,
    datatable: {
      loading: false,
      pageCount: 0,
      search: '',
      data: []
    }
  })

  const formikNewSeller = useFormik({
    initialValues: {
      name: '',
      company: '',
    },
    validationSchema: newSellerSchema,
    onSubmit: (values, { setFieldError, setSubmitting }) => {
      return createSeller({
        name: values.name,
        company: values.company,
      }).then(resp => {
        setState(state => ({ ...state, modalAdd: false }))
        return fetchData({})
      })
    },
  });

  const formikUpdateSeller = useFormik({
    initialValues: {
      name: '',
      company: '',
    },
    validationSchema: newSellerSchema,
    onSubmit: (values, { setFieldError, setSubmitting }) => {
      return createSeller({
        name: values.name,
        company: values.company,
      }).then(resp => {
        setState(state => ({ ...state, modalAdd: false }))
        return fetchData({})
      })
    },
  });

  const fetchIdRef = React.useRef(0)

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Company',
        accessor: 'company',
      },
    ],
    []
  )

  const fetchData = React.useCallback(({ pageSize = 10, pageIndex = 0, search = '' }) => {
    // This will get called when the table needs new data
    // You could fetch your data from literally anywhere,
    // even a server. But for this example, we'll just fake it.

    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current

    // Set the loading state
    setState(state => ({
      ...state,
      datatable: {
        ...state.datatable,
        loading: true,
      }
    }))

    if (fetchId === fetchIdRef.current) {
      getAllSellers({ page: pageIndex, first: pageSize, search: search }).then(resp => {
        setState(state => ({
          ...state,
          datatable: {
            data: resp.data,
            loading: false,
            pageCount: Math.ceil(resp.meta.totalCount / pageSize)
          }
        }))
      })
    }
  }, [])

  const handleRowClick = (data) => alert(data)

  const handleClose = () => setState(state => ({ ...state, modalAdd: false }));
  const handleShow = () => setState(state => ({ ...state, modalAdd: true }));

  const handleCloseUpdate = () => setState(state => ({ ...state, modalUpdate: false }));
  const handleShowUpdate = () => setState(state => ({ ...state, modalUpdate: true }));

  return <Layout>
    <Row>
      <Col xs={12}>
        <Button onClick={handleShow} variant="primary">Add New Seller</Button>
      </Col>
      <Col xs={12}>
        <Table
          columns={columns}
          data={state.datatable.data}
          fetchData={fetchData}
          loading={state.datatable.loading}
          pageCount={state.datatable.pageCount}
          onRowClick={handleRowClick}
        />
      </Col>
    </Row>

    <Modal show={state.modalAdd} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Seller</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikNewSeller.handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label htmlFor="name">Name</Form.Label>
            <Form.Control className={(formikNewSeller.touched.name &&
              formikNewSeller.errors.name) && "is-invalid"} name="name" type="text" onChange={formikNewSeller.handleChange} value={formikNewSeller.values.name} />
            {(formikNewSeller.touched &&
              formikNewSeller.errors.name) &&
              <Form.Control.Feedback type="invalid">{formikNewSeller.errors.name}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="company">Company</Form.Label>
            <Form.Control className={(formikNewSeller.touched.company &&
              formikNewSeller.errors.company) && "is-invalid"} name="company" type="text" onChange={formikNewSeller.handleChange} value={formikNewSeller.values.company} />
            {(formikNewSeller.touched &&
              formikNewSeller.errors.company) &&
              <Form.Control.Feedback type="invalid">{formikNewSeller.errors.company}</Form.Control.Feedback>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" disabled={formikNewSeller.isSubmitting}>
            {formikNewSeller.isSubmitting ? <Spinner
              animation="border"
              variant="light"
              size="sm" /> : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>

    <Modal show={state.modalUpdate} onHide={handleCloseUpdate}>
      <Modal.Header closeButton>
        <Modal.Title>New Seller</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikNewSeller.handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label htmlFor="name">Name</Form.Label>
            <Form.Control className={(formikNewSeller.touched.name &&
              formikNewSeller.errors.name) && "is-invalid"} name="name" type="text" onChange={formikNewSeller.handleChange} value={formikNewSeller.values.name} />
            {(formikNewSeller.touched &&
              formikNewSeller.errors.name) &&
              <Form.Control.Feedback type="invalid">{formikNewSeller.errors.name}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="company">Company</Form.Label>
            <Form.Control className={(formikNewSeller.touched.company &&
              formikNewSeller.errors.company) && "is-invalid"} name="company" type="text" onChange={formikNewSeller.handleChange} value={formikNewSeller.values.company} />
            {(formikNewSeller.touched &&
              formikNewSeller.errors.company) &&
              <Form.Control.Feedback type="invalid">{formikNewSeller.errors.company}</Form.Control.Feedback>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleCloseUpdate}>
            Close
          </Button>
          <Button variant="primary" type="submit" disabled={formikNewSeller.isSubmitting}>
            {formikNewSeller.isSubmitting ? <Spinner
              animation="border"
              variant="light"
              size="sm" /> : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  </Layout>
}

export default Home
