var configData = {
	documentType: {
		providerInvoice: {
			_id: 1,
			description: "Cuenta por Pagar",
			accountEntryOrigin: "Crédito",
			origin: 'Crédito',
			accountCategory: "Pasivo",
			accountCategory2: "Gasto"
		},
		paymentRequest: {
			_id: 2,
			description: "Solicitud de Pago",
			accountCategory: "Activo"
		},
		payment: {
			_id: 3,
			description: "Pago",
			accountEntryOrigin: "Crédito",
			origin: 'Débito',
			accountCategory: "Activo"
		},
		invoice: {
			_id: 4,
			description: "Factura",
			accountEntryOrigin: "Débito",
			origin: 'Crédito',
			accountCategory: "Activo",
			accountCategory2: "Ingreso"
		},
		paymentReceipt: {
			_id: 5,
			description: "Recibo De Pago",
			accountEntryOrigin: "Débito",
			origin: 'Débito',
			accountCategory: "Ingreso"
		},
		manualEntry: {
			_id: 6,
			description: "Entrada Manual"
		},
		creditNote: {
			_id: 7,
			description: "Nota de Crédito",
			origin: 'Débito'
		},
		debitNote: {
			_id:8,
			description: "Nota de Débito",
			origin: 'Débito'
		},
		clientPaymentRequest: {
			_id: 9,
			description: "Solicitud de Pago Cliente"
		},
		check: {
			_id: 10,
			description: "Cheque",
			accountEntryOrigin: "Crédito",
			origin: 'Débito',
			accountCategory: "Activo"
		},
		deposit: {
			_id: 11,
			description: "Depósito",
			accountEntryOrigin: "Débito",
			origin: 'Débito',
			accountCategory: "Activo"
		},
		subcription: {
		  _id: 14,
		  description: "Abono",
		},
	},
	invoiceStatus: {
		pending: 'Pendiente',
		paymentRequested: 'Pago Solicitado',
		partiallyPaid: 'Pagada Parcialmente',
		paid: 'Pagada'
	},
	billStatus: {
		_id: 6,
		pending: 'Pendiente',
		paymentRequested: 'Pago Solicitado',
		partiallyPaid: 'Pagada Parcialmente',
		paid: 'Pagada'
	},
	paymentRequestStatus: {
		_id: 7,
		pending: 'Pendiente',
		partiallyPaid: 'Pagada Parcialmente',
		paid: 'Pagada'
	}, 

	currencyDifferenceAccountId: 43 
};

module.exports = configData;
// module.exports = invoiceStatus;