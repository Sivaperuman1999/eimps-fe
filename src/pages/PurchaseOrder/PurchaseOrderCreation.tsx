import {
    useEffect,
    useState,
} from 'react';

import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

import {
    Controller,
    useFieldArray,
    useForm,
} from 'react-hook-form';

import {
    yupResolver,
} from '@hookform/resolvers/yup';


import api from '../../api/axios';

import purchaseOrderService from '../../services/purchaseOrderService';

import type {
    PurchaseOrder,
} from '../../types/purchaseOrderTypes';

import {
    purchaseOrderSchema,
    type PurchaseOrderFormData,
} from '../../validation/purchaseOrderSchema';

import {
    getApiErrorMessage,
} from '../../utils/apiError';


/* =========================
   VENDOR TYPE
========================= */

interface Vendor {
    id: string;
    name: string;
    code?: string;
    isActive?: boolean;
}


/* =========================
   ITEM TYPE
========================= */

interface Item {
    id: string;
    name: string;
    sku?: string;
    unitPrice?: string | number;
    isActive?: boolean;
}


/* =========================
   PROPS
========================= */

interface PurchaseOrderCreationProps {
    open: boolean;

    onClose: () => void;

    purchaseOrder?: PurchaseOrder | null;

    onSaved: (
        message: string,
    ) => void;

    onError?: (
        message: string,
    ) => void;
}


function PurchaseOrderCreation({
    open,
    onClose,
    purchaseOrder,
    onSaved,
    onError,
}: PurchaseOrderCreationProps) {

    /* =========================
       STATE
    ========================= */

    const [
        isLoading,
        setIsLoading,
    ] = useState(false);

    const [
        vendors,
        setVendors,
    ] = useState<Vendor[]>([]);

    const [
        items,
        setItems,
    ] = useState<Item[]>([]);

    const [
        isLoadingVendors,
        setIsLoadingVendors,
    ] = useState(false);

    const [
        isLoadingItems,
        setIsLoadingItems,
    ] = useState(false);


    /* =========================
       FORM
    ========================= */

    const {
        control,
        handleSubmit,
        reset,
        setValue,
    } = useForm<PurchaseOrderFormData>({

        resolver:
            yupResolver(
                purchaseOrderSchema,
            ),

        defaultValues: {

            vendorId: '',

            orderDate: '',

            items: [
                {
                    itemId: '',
                    quantity: 1,
                    unitPrice: 0,
                },
            ],

        },

    });


    /* =========================
       FIELD ARRAY
    ========================= */

    const {
        fields,
        append,
        remove,
    } = useFieldArray({

        control,

        name: 'items',

    });


    /* =========================
       GET VENDORS
    ========================= */

    const getVendors = async () => {

        setIsLoadingVendors(true);

        try {

            const response =
                await api.get('/vendors');

            /*
             * Supports:
             *
             * response.data
             *
             * OR
             *
             * response.data.data
             *
             * OR
             *
             * response.data.data.vendors
             */

            const responseData =
                response.data;

            let vendorList: Vendor[] = [];

            if (
                Array.isArray(responseData)
            ) {

                vendorList =
                    responseData;

            } else if (
                Array.isArray(
                    responseData?.data,
                )
            ) {

                vendorList =
                    responseData.data;

            } else if (
                Array.isArray(
                    responseData?.data?.vendors,
                )
            ) {

                vendorList =
                    responseData.data.vendors;

            } else if (
                Array.isArray(
                    responseData?.vendors,
                )
            ) {

                vendorList =
                    responseData.vendors;

            }

            setVendors(vendorList);

        } catch (error: unknown) {

            onError?.(
                getApiErrorMessage(
                    error,
                    'Unable to load vendors',
                ),
            );

        } finally {

            setIsLoadingVendors(false);

        }
    };


    /* =========================
       GET ITEMS
    ========================= */

    const getItems = async () => {

        setIsLoadingItems(true);

        try {

            const response =
                await api.get('/items');

            const responseData =
                response.data;

            let itemList: Item[] = [];

            if (
                Array.isArray(responseData)
            ) {

                itemList =
                    responseData;

            } else if (
                Array.isArray(
                    responseData?.data,
                )
            ) {

                itemList =
                    responseData.data;

            } else if (
                Array.isArray(
                    responseData?.data?.items,
                )
            ) {

                itemList =
                    responseData.data.items;

            } else if (
                Array.isArray(
                    responseData?.items,
                )
            ) {

                itemList =
                    responseData.items;

            }

            setItems(itemList);

        } catch (error: unknown) {

            onError?.(
                getApiErrorMessage(
                    error,
                    'Unable to load items',
                ),
            );

        } finally {

            setIsLoadingItems(false);

        }
    };


    /* =========================
       LOAD DROPDOWNS
    ========================= */

    useEffect(() => {

        if (!open) {
            return;
        }

        getVendors();
        getItems();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);


    /* =========================
       RESET FORM
    ========================= */

    useEffect(() => {

        if (purchaseOrder) {

            reset({

                vendorId:
                    purchaseOrder.vendorId,

                /*
                 * HTML date input needs:
                 * YYYY-MM-DD
                 */

                orderDate:
                    purchaseOrder.orderDate
                        ? purchaseOrder.orderDate
                            .split('T')[0]
                        : '',

                items:
                    purchaseOrder.items?.map(
                        (item) => ({
                            itemId: item.itemId,

                            quantity:
                                Number(
                                    item.quantity,
                                ),

                            unitPrice:
                                Number(
                                    item.unitPrice,
                                ),
                        }),
                    ) || [
                        {
                            itemId: '',
                            quantity: 1,
                            unitPrice: 0,
                        },
                    ],

            });

        } else {

            reset({

                vendorId: '',

                orderDate: '',

                items: [
                    {
                        itemId: '',
                        quantity: 1,
                        unitPrice: 0,
                    },
                ],

            });

        }

    }, [
        purchaseOrder,
        open,
        reset,
    ]);


    /* =========================
       ITEM CHANGE
       AUTO SET UNIT PRICE
    ========================= */

    const handleItemChange = (
        itemId: string,
        index: number,
    ) => {

        const selectedItem =
            items.find(
                (item) =>
                    item.id === itemId,
            );

        if (
            selectedItem?.unitPrice !==
            undefined
        ) {

            setValue(
                `items.${index}.unitPrice`,
                Number(selectedItem.unitPrice),
            );

        }

    };


    /* =========================
       SAVE
    ========================= */

    const handleSave = async (
        data: PurchaseOrderFormData,
    ) => {

        setIsLoading(true);

        try {

            const payload = {

                vendorId:
                    data.vendorId,

                orderDate:
                    data.orderDate,

                items:
                    data.items.map(
                        (item) => ({
                            itemId:
                                item.itemId,

                            quantity:
                                Number(item.quantity),

                            unitPrice:
                                Number(item.unitPrice),
                        }),
                    ),

            };


            /* =====================
               UPDATE
            ===================== */

            if (purchaseOrder) {

                const response =
                    await purchaseOrderService
                        .updatePurchaseOrder(

                            String(
                                purchaseOrder.id,
                            ),

                            payload,
                        );

                onSaved(
                    response?.message ||
                    'Purchase order updated successfully',
                );

            }


            /* =====================
               CREATE
            ===================== */

            else {

                const response =
                    await purchaseOrderService
                        .createPurchaseOrder(
                            payload,
                        );

                onSaved(
                    response?.message ||
                    'Purchase order created successfully',
                );

            }

            onClose();

        } catch (error: unknown) {

            onError?.(
                getApiErrorMessage(

                    error,

                    purchaseOrder
                        ? 'Unable to update purchase order'
                        : 'Unable to create purchase order',

                ),
            );

        } finally {

            setIsLoading(false);

        }

    };


    /* =========================
       RENDER
    ========================= */

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>

                {purchaseOrder
                    ? 'Edit Purchase Order'
                    : 'Create Purchase Order'}

            </DialogTitle>


            <form
                onSubmit={
                    handleSubmit(
                        handleSave,
                    )
                }
            >

                <DialogContent>


                    {/* =====================
              VENDOR
          ===================== */}

                    <Controller
                        name="vendorId"
                        control={control}
                        render={({ field, fieldState }) => {
                            const availableVendors = vendors.filter(
                                (vendor) =>
                                    vendor.isActive !== false ||
                                    vendor.id === field.value,
                            );

                            return (
                                <TextField
                                    {...field}
                                    value={field.value || ''}
                                    fullWidth
                                    select
                                    label="Vendor"
                                    margin="normal"
                                    disabled={isLoadingVendors}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                >
                                    {isLoadingVendors ? (
                                        <MenuItem disabled>
                                            Loading vendors...
                                        </MenuItem>
                                    ) : availableVendors.length === 0 ? (
                                        <MenuItem disabled>
                                            No vendors found
                                        </MenuItem>
                                    ) : (
                                        availableVendors.map((vendor) => (
                                            <MenuItem
                                                key={vendor.id}
                                                value={vendor.id}
                                            >
                                                {vendor.name}
                                                {vendor.code
                                                    ? ` (${vendor.code})`
                                                    : ''}
                                                {vendor.isActive === false
                                                    ? ' - Inactive'
                                                    : ''}
                                            </MenuItem>
                                        ))
                                    )}
                                </TextField>
                            );
                        }}
                    />

                    {/* =====================
              ORDER DATE
          ===================== */}

                    <Controller
                        name="orderDate"
                        control={control}

                        render={({
                            field,
                            fieldState,
                        }) => (

                            <TextField

                                {...field}

                                fullWidth

                                type="date"

                                label="Order Date"

                                margin="normal"

                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}

                                error={
                                    !!fieldState.error
                                }

                                helperText={
                                    fieldState.error
                                        ?.message
                                }

                            />

                        )}

                    />


                    {/* =====================
              ITEMS TITLE
          ===================== */}

                    <Typography
                        variant="h6"
                        sx={{
                            mt: 3,
                            mb: 2,
                        }}
                    >
                        Purchase Order Items
                    </Typography>


                    {/* =====================
              ITEMS
          ===================== */}

                    {fields.map(
                        (
                            field,
                            index,
                        ) => (

                            <Stack
                                key={field.id}
                                direction={{
                                    xs: 'column',
                                    sm: 'row',
                                }}
                                spacing={2}
                                sx={{
                                    mb: 2,
                                    alignItems: {
                                        xs: 'stretch',
                                        sm: 'center',
                                    },
                                }}
                            >


                                {/* ITEM */}

                                <Controller
                                    name={
                                        `items.${index}.itemId`
                                    }
                                    control={control}

                                    render={({
                                        field,
                                        fieldState,
                                    }) => (

                                        <TextField

                                            {...field}

                                            value={
                                                field.value || ''
                                            }

                                            select

                                            label="Item"

                                            sx={{
                                                flex: 2,
                                            }}

                                            disabled={
                                                isLoadingItems
                                            }

                                            error={
                                                !!fieldState.error
                                            }

                                            helperText={
                                                fieldState.error
                                                    ?.message
                                            }

                                            onChange={(
                                                event,
                                            ) => {

                                                const itemId =
                                                    event.target.value as string;

                                                field.onChange(
                                                    itemId,
                                                );

                                                handleItemChange(
                                                    itemId,
                                                    index,
                                                );

                                            }}

                                        >

                                            {isLoadingItems ? (

                                                <MenuItem
                                                    disabled
                                                >

                                                    <CircularProgress
                                                        size={20}
                                                        sx={{
                                                            mr: 1,
                                                        }}
                                                    />

                                                    Loading items...

                                                </MenuItem>

                                            ) : items.length === 0 ? (

                                                <MenuItem
                                                    disabled
                                                >
                                                    No items found
                                                </MenuItem>

                                            ) : (

                                                items
                                                    .filter(
                                                        (item) =>
                                                            item.isActive !==
                                                            false,
                                                    )
                                                    .map(
                                                        (item) => (

                                                            <MenuItem
                                                                key={
                                                                    item.id
                                                                }
                                                                value={
                                                                    item.id
                                                                }
                                                            >

                                                                {item.name}

                                                                {item.sku
                                                                    ? ` (${item.sku})`
                                                                    : ''}

                                                            </MenuItem>

                                                        ),
                                                    )

                                            )}

                                        </TextField>

                                    )}

                                />


                                {/* QUANTITY */}

                                <Controller
                                    name={
                                        `items.${index}.quantity`
                                    }
                                    control={control}

                                    render={({
                                        field,
                                        fieldState,
                                    }) => (

                                        <TextField

                                            {...field}

                                            type="number"

                                            label="Quantity"

                                            sx={{
                                                flex: 1,
                                            }}


                                            error={
                                                !!fieldState.error
                                            }

                                            helperText={
                                                fieldState.error
                                                    ?.message
                                            }

                                        />

                                    )}

                                />


                                {/* UNIT PRICE */}

                                <Controller
                                    name={
                                        `items.${index}.unitPrice`
                                    }
                                    control={control}

                                    render={({
                                        field,
                                        fieldState,
                                    }) => (

                                        <TextField

                                            {...field}

                                            type="number"

                                            label="Unit Price"

                                            sx={{
                                                flex: 1,
                                            }}



                                            error={
                                                !!fieldState.error
                                            }

                                            helperText={
                                                fieldState.error
                                                    ?.message
                                            }

                                        />

                                    )}

                                />


                                {/* DELETE ITEM */}

                                <IconButton

                                    color="error"

                                    onClick={() =>
                                        remove(index)
                                    }

                                    disabled={
                                        fields.length === 1 ||
                                        isLoading
                                    }

                                >

                                    <DeleteIcon />

                                </IconButton>

                            </Stack>

                        ),
                    )}


                    {/* =====================
              ADD ITEM
          ===================== */}

                    <Button

                        variant="outlined"

                        onClick={() =>
                            append({
                                itemId: "",
                                quantity: 1,
                                unitPrice: 0,
                            })
                        }

                        disabled={
                            isLoading ||
                            isLoadingItems
                        }

                    >

                        + Add Item

                    </Button>


                    {/* =====================
              INFO
          ===================== */}

                    {!isLoadingItems &&
                        items.length === 0 && (

                            <Alert
                                severity="warning"
                                sx={{
                                    mt: 2,
                                }}
                            >
                                No active items are
                                available.
                            </Alert>

                        )}

                </DialogContent>


                {/* =========================
            ACTIONS
        ========================= */}

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2,
                    }}
                >

                    <Button
                        onClick={onClose}
                        variant="outlined"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>


                    <Button
                        type="submit"
                        variant="contained"
                        disabled={
                            isLoading ||
                            isLoadingVendors ||
                            isLoadingItems
                        }
                    >

                        {isLoading

                            ? 'Saving...'

                            : purchaseOrder
                                ? 'Update Purchase Order'
                                : 'Create Purchase Order'}

                    </Button>

                </DialogActions>

            </form>

        </Dialog>

    );
}

export default PurchaseOrderCreation;